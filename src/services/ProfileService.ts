import {
  ModeStat,
  PlayerProfile,
  PlayerStatsRaceOnMapVersusRace,
  RaceStat,
} from "@/store/player/types";
import { API_URL } from "@/main";
import { Gateways } from "@/store/ranking/types";

export default class ProfileService {
  public async retrieveWinRate(
    battleTag: string,
    season: number
  ): Promise<RaceStat> {
    const url = `${API_URL}api/players/${encodeURIComponent(
      battleTag
    )}/winrate?season=${season}`;
    const response = await fetch(url);

    const data = await response.json();
    return data.stats;
  }

  public async retrieveProfile(battleTag: string): Promise<PlayerProfile> {
    const url = `${API_URL}api/players/${encodeURIComponent(battleTag)}`;

    const response = await fetch(url);

    return await response.json();
  }

  public async searchPlayer(search: string): Promise<PlayerProfile[]> {
    const url = `${API_URL}api/players/?search=${search}`;

    const response = await fetch(url);

    return await response.json();
  }

  public async invitePlayer(
    battleTag: string,
    clanId: string,
    token: string
  ): Promise<string> {
    const url = `${API_URL}api/clans/${clanId}/invites?authorization=${token}`;

    const post = { PlayerBattleTag: battleTag };
    const data = JSON.stringify(post);
    const response = await fetch(url, {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return response.ok ? "" : (await response.json()).error;
  }

  public async retrieveGameModeStats(
    battleTag: string,
    gateWay: Gateways,
    season: number
  ): Promise<ModeStat[]> {
    const url = `${API_URL}api/players/${encodeURIComponent(
      battleTag
    )}/game-mode-stats?gateWay=${gateWay}&season=${season}`;

    const response = await fetch(url);

    return await response.json();
  }

  public async retrieveRaceStats(
    battleTag: string,
    gateWay: Gateways,
    season: number
  ): Promise<RaceStat[]> {
    const url = `${API_URL}api/players/${encodeURIComponent(
      battleTag
    )}/race-stats?gateWay=${gateWay}&season=${season}`;

    const response = await fetch(url);

    return await response.json();
  }

  public async retrievePlayerStatsRaceVersusRaceOnMap(
    battleTag: string,
    season: number
  ): Promise<PlayerStatsRaceOnMapVersusRace> {
    const url = `${API_URL}api/player-stats/${encodeURIComponent(
      battleTag
    )}/race-on-map-versus-race?season=${season}`;

    const response = await fetch(url);
    return await response.json();
  }
}
