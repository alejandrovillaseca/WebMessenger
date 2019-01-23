import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Idummy } from '../interfaces/dummy';
import { DataResponse } from '../interfaces/DataResponse';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  endpoint: string = "https://reqres.in/api/"
  dummy: Idummy
  constructor(private httpClient: HttpClient) { }

  //POST!!!!!
  getDummy() {
    return this.httpClient.post<DataResponse>('http://jsonplaceholder.typicode.com/posts', {
      title: 'foo',
      body: 'bar',
      userId: 1
    })
  }
}
