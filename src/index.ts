import { server   } from './server';

server({
    preTap:({request}) => console.log(request),
    postTap:({response}) => console.log(response),
    catchTap: error => console.error(error),
}).listen(3000);
