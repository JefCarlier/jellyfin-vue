import { Context } from '@nuxt/types/app';
import sinon from 'sinon';
import serverMiddleware from '../serverMiddleware';

const spy = sinon.spy();

const BASE_INPUT = ({
  $axios: {
    defaults: {
      baseURL: ''
    }
  },
  store: {
    state: {
      servers: {
        serverList: []
      }
    }
  },
  redirect: spy
} as unknown) as Context;

const INPUT_WITH_BASEURL = ({
  ...BASE_INPUT,
  $axios: { defaults: { baseURL: 'test-url' } }
} as unknown) as Context;

const INPUT_WITH_SERVERLIST = ({
  ...BASE_INPUT,
  store: { state: { servers: { serverList: ['item-a'] } } }
} as unknown) as Context;

const INPUT_WITH_BOTH = ({
  ...BASE_INPUT,
  $axios: { defaults: { baseURL: 'test-url' } },
  store: { state: { servers: { serverList: ['item-a'] } } }
} as unknown) as Context;

const EXPECTED_REDIRECT = '/addserver';

afterEach(() => spy.resetHistory());

describe('serverMiddleware', () => {
  it('redirect to "/addserver/ when a baseUrl is not set', (): void => {
    serverMiddleware(BASE_INPUT);

    expect(spy.getCall(0).args[0]).toBe(EXPECTED_REDIRECT);
  });

  it('redirects to "/addserver" when the serverlist length is 0', (): void => {
    serverMiddleware(INPUT_WITH_BASEURL);

    expect(spy.getCall(0).args[0]).toBe(EXPECTED_REDIRECT);
  });

  it('redirects to "/addserver" when the baseUrl is undefined', (): void => {
    serverMiddleware(INPUT_WITH_SERVERLIST);

    expect(spy.getCall(0).args[0]).toBe(EXPECTED_REDIRECT);
  });

  it('does not redirect when a baseUrl is set and a serverlist is defined', (): void => {
    serverMiddleware(INPUT_WITH_BOTH);

    expect(spy.getCalls().length).toBe(0);
  });
});
