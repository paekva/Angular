import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { Feedback } from '../shared/Feedback';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService,
    @Inject('baseURL') baseUrl
  ) { }

  submitFeedback(feedBack: Feedback): Observable<Feedback>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    console.log(feedBack);
    return this.http.post<Feedback>(baseUrl+'feedback', feedBack, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
