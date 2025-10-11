import { describe, it, expect } from 'vitest';
import { StravaService } from '../../src/services/stravaService';
import { ActivityMapper } from '../../src/mappers/activityMapper';
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

class FakeActivityMapper {
  async toActivity(activities: StravaActivity[]) {
    return activities.map(a => ({ ...a, transformed: true }));
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
    (service as any).activityMapper = new FakeActivityMapper();

    const token = 'test-token';
    const perPage = 2;
    const result = await service.getActivities(token, perPage);

    expect(fakeClient.lastToken).toBe(token);
    expect(fakeClient.lastPerPage).toBe(perPage);
    expect(result[0]).toHaveProperty('transformed', true);
  });

  it('test_getActivities_propagatesFetchError', async () => {
    const service = new StravaService();
    (service as any).stravaClient = new FakeStravaClientError();

    await expect(service.getActivities('token', 5)).rejects.toThrow('fetch failed');
  });
});