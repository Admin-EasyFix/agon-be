import { describe, it, expect, vi } from 'vitest';
import { StravaService } from '../../src/services/stravaService';
import type { StravaActivity } from '../../src/types/strava/StravaActivity';
import { StravaClient } from '../../src/clients/stravaClient';

vi.mock('../../src/clients/stravaClient');

class FakeActivityMapper {
  async toActivities(activities: StravaActivity[], options?: { withAi: boolean }) {
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
    (service as any).activityMapper = new FakeActivityMapper();

    const mockFetchActivities = vi.fn().mockResolvedValue(activities);
    (StravaClient as unknown as any).mockImplementation(() => {
      return {
        fetchActivities: mockFetchActivities,
      };
    });

    const token = 'test-token';
    const perPage = 2;
    const result = await service.getActivities(token, perPage);

    expect(StravaClient).toHaveBeenCalledWith(token);
    expect(mockFetchActivities).toHaveBeenCalledWith(perPage);
    expect(result[0]).toHaveProperty('transformed', true);
  });

  it('test_getActivities_propagatesFetchError', async () => {
    const service = new StravaService();
    (StravaClient as unknown as any).mockImplementation(() => {
      return {
        fetchActivities: vi.fn().mockRejectedValue(new Error('fetch failed')),
      };
    });

    await expect(service.getActivities('token', 5)).rejects.toThrow('fetch failed');
  });
});