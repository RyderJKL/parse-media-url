import { server as run } from '../../../server';
import  request from 'supertest'
import { Server } from 'http';

describe(('http'), () => {
    let server: Server;
    beforeAll(() => {
        server = run({}).listen(3003)
    })
    it('Get /media', () => {
        return request(server).get('/media').expect(200)
    })
})
