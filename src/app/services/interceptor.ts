import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from './spinner.service';

@Injectable()
export class Interceptor implements HttpInterceptor {

    constructor(public spinnerService: SpinnerService) { }

    /**
     * Intercept the HTTP response.
     * 
     * @param {HttpRequest<any>} req the request of the HTTP
     * @param {HttpHandler} next handle the response of the HTTP
     * 
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.spinnerService.isLoading.next(true);

        return next.handle(req).pipe(
            finalize(() => {
                this.spinnerService.isLoading.next(false);
            }),
        )
    }

}