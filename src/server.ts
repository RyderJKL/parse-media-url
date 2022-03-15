import Koa, { Context } from 'koa';
import { Subject, of, from } from 'rxjs';
import { tap, catchError, mergeMap, mapTo, single } from 'rxjs/operators';
import bodyParser from 'koa-bodyparser';
import router from './router';

export type Props = {
    preTap: (ctx: Context) => void;
    postTap: (ctx: Context) => void;
    catchTap:(error: any) => void;
}

export const server = ({preTap, postTap, catchTap}: Props) => {
    const handleError = (error: any) => of(catchError(error));

    const listen = (...params: any) => {
        new Koa()
        .use(router.routes())
        .use(router.allowedMethods())
        .use(bodyParser())
        .use(async (ctx, next) => {
            const root$ = new Subject<Context>();

            const done$ = new Subject<void>();

            const subscription = root$
            .pipe(
              tap(preTap),
              single(),
              tap(postTap),
              catchError(handleError),
              tap(() => done$.complete()),
            )
            .subscribe();
        
            root$.next(ctx);
            root$.complete();

            await from(done$);

            subscription.unsubscribe();
            next();
        }).listen(...params)
    }

    return {
        listen
    }
} 