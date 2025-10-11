import { describe, it, expect } from 'vitest';
import { ActivityMapper } from '../../src/mappers/activityMapper';
import type { StravaActivity } from '../../src/types/StravaActivity';

class FakeAIService {
  generateCommentForActivity(activity: StravaActivity): string {
    return `Fallback comment for ${activity.id}`;
  }

  async generateCommentsForActivitiesBatch(activities: StravaActivity[]): Promise<Record<string, string>> {
    const comments: Record<string, string> = {};
    activities.forEach(activity => {
      comments[activity.id.toString()] = `AI comment for ${activity.id}`;
    });
    return comments;
  }
}

describe('ActivityMapper', () => {
  it('test_transformActivities_handlesFullData', async () => {
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
    ];

    const mapper = new ActivityMapper(new FakeAIService() as any);
    const result = await mapper.toActivities(activities);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: '123',
      name: 'Morning Run',
      date: '2023-01-01T00:00:00Z',
      distance: 10.0,
      pace: '5:00',
      duration: 50,
      description: 'Fallback comment for 123',
      elevation: 100,
      heartRate: 145,
      type: 'running'
    });
  });

  it('test_transformActivities_handlesMissingMetricsWithDefaults', async () => {
    const mapper = new ActivityMapper(new FakeAIService() as any);

    const incomplete: StravaActivity = {
      id: 789,
      name: 'Untitled',
      type: 'Run',
      start_date: '2023-01-03T00:00:00Z',
      start_date_local: '2023-01-03T01:00:00Z',
      timezone: 'UTC',
      utc_offset: 0
    };

    const result = await mapper.toActivities([incomplete]);
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
      description: 'Fallback comment for 789'
    });

    expect(activity.elevation).toBeUndefined();
    expect(activity.heartRate).toBeUndefined();
  });

  it('test_calculatePace_formatsMmSsWithZeroPadding', () => {
    const mapper = new ActivityMapper(new FakeAIService() as any);
    // 1000 m in 305 s => 305 s/km => 5:05
    const pace = (mapper as any).calculatePace(1000, 305);
    expect(pace).toBe('5:05');
  });

  it('test_mapActivityType_mapsKnownStravaTypes', () => {
    const mapper = new ActivityMapper(new FakeAIService() as any);
    expect((mapper as any).mapActivityType('Run')).toBe('running');
    expect((mapper as any).mapActivityType('Ride')).toBe('cycling');
    expect((mapper as any).mapActivityType('Swim')).toBe('swimming');
    expect((mapper as any).mapActivityType('Hike')).toBe('hiking');
    expect((mapper as any).mapActivityType('Walk')).toBe('hiking');
  });

  it("test_mapActivityType_defaultsToOtherForUnknownType", () => {
    const mapper = new ActivityMapper(new FakeAIService() as any);
    expect((mapper as any).mapActivityType('Ski')).toBe('other');
    expect((mapper as any).mapActivityType('Yoga')).toBe('other');
  });
});