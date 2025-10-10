import { describe, it, expect } from 'vitest';
import { StravaService } from '../../src/services/stravaService';
import type { StravaActivity } from '../../src/types/StravaActivity';

class FakeStravaClientSuccess {
  public lastToken: string | null = null;
  public lastPerPage: number | null = null;

  constructor(private activities: StravaActivity[]) {}

  async fetchActivities(accessToken: string, perPage: number = 10): Promise<StravaActivity[]> {
    this.lastToken = accessToken;
    this.lastPerPage = perPage;
    return this.activities;
  }
}

class FakeStravaClientError {
  async fetchActivities(): Promise<StravaActivity[]> {
    throw new Error('fetch failed');
  }
}

class FakeAIService {
  async generateCommentForActivity(): Promise<string> {
    return 'Great job!';
  }
}

describe('StravaService', () => {
  it('test_getActivities_fetchesAndTransformsActivities', async () => {
    const activities: StravaActivity[] = [
      {
        id: 123,
        name: 'Morning Run',
        distance: 10000,
        moving_time: 3000,
        elapsed_time: 3200,
        total_elevation_gain: 100,
        type: 'Run',
        start_date: '2023-01-01T00:00:00Z',
        start_date_local: '2023-01-01T01:00:00Z',
        timezone: 'UTC',
        utc_offset: 0,
        average_heartrate: 145
      },
      {
        id: 456,
        name: 'Evening Ride',
        distance: 5555,
        moving_time: 1000,
        elapsed_time: 1100,
        total_elevation_gain: 50,
        type: 'Ride',
        start_date: '2023-01-02T00:00:00Z',
        start_date_local: '2023-01-02T01:00:00Z',
        timezone: 'UTC',
        utc_offset: 0,
        average_heartrate: 135
      }
    ];

    const service = new StravaService();
    const fakeClient = new FakeStravaClientSuccess(activities);
    (service as any).stravaClient = fakeClient;
    (service as any).aiService = new FakeAIService();

    const token = 'test-token';
    const perPage = 2;
    const result = await service.getActivities(token, perPage);

    expect(fakeClient.lastToken).toBe(token);
    expect(fakeClient.lastPerPage).toBe(perPage);

    expect(result).toHaveLength(2);

    // First activity assertions
    expect(result[0]).toMatchObject({
      id: '123',
      name: 'Morning Run',
      date: '2023-01-01T00:00:00Z',
      distance: 10.0,
      pace: '5:00',
      duration: 50,
      description: 'Great job!',
      elevation: 100,
      heartRate: 145,
      type: 'running'
    });

    // Second activity assertions
    expect(result[1]).toMatchObject({
      id: '456',
      name: 'Evening Ride',
      date: '2023-01-02T00:00:00Z',
      distance: 5.6,
      pace: '3:00',
      duration: 17,
      description: 'Great job!',
      elevation: 50,
      heartRate: 135,
      type: 'cycling'
    });
  });

  it('test_calculatePace_formatsMmSsWithZeroPadding', () => {
    const service = new StravaService();
    // 1000 m in 305 s => 305 s/km => 5:05
    const pace = (service as any).calculatePace(1000, 305);
    expect(pace).toBe('5:05');
  });

  it('test_mapActivityType_mapsKnownStravaTypes', () => {
    const service = new StravaService();
    expect((service as any).mapActivityType('Run')).toBe('running');
    expect((service as any).mapActivityType('Ride')).toBe('cycling');
    expect((service as any).mapActivityType('Swim')).toBe('swimming');
    expect((service as any).mapActivityType('Hike')).toBe('hiking');
    expect((service as any).mapActivityType('Walk')).toBe('hiking');
  });

  it('test_getActivities_propagatesFetchError', async () => {
    const service = new StravaService();
    (service as any).stravaClient = new FakeStravaClientError();
    (service as any).aiService = new FakeAIService();

    await expect(service.getActivities('token', 5)).rejects.toThrow('fetch failed');
  });

  it('test_transformActivities_handlesMissingMetricsWithDefaults', async () => {
    const service = new StravaService();
    (service as any).aiService = new FakeAIService();

    const incomplete: StravaActivity = {
      id: 789,
      name: 'Untitled',
      type: 'Run',
      start_date: '2023-01-03T00:00:00Z',
      start_date_local: '2023-01-03T01:00:00Z',
      timezone: 'UTC',
      utc_offset: 0
      // distance, moving_time, elevation, hr omitted
    };

    const result = await service.transformActivities([incomplete]);
    expect(result).toHaveLength(1);
    const activity = result[0];

    expect(activity).toMatchObject({
      id: '789',
      name: 'Untitled',
      date: '2023-01-03T00:00:00Z',
      distance: 0,
      duration: 0,
      pace: '--:--',
      type: 'running',
      description: 'Great job!'
    });

    expect(activity.elevation).toBeUndefined();
    expect(activity.heartRate).toBeUndefined();
  });

  it("test_mapActivityType_defaultsToOtherForUnknownType", () => {
    const service = new StravaService();
    expect((service as any).mapActivityType('Ski')).toBe('other');
    expect((service as any).mapActivityType('Yoga')).toBe('other');
  });
});