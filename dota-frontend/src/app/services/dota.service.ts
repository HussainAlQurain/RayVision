import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DotaService {

  constructor(private http: HttpClient) { }

  private baseUrl = environment.apiUrl;

  getPlayerLiveGame(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/dota/player/${id}`);
  }

  getPlayerLastGames(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/dota/games/${id}`);
  }

}
