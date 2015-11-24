import { provide } from 'angular2/src/core/di';
import { FORM_PROVIDERS } from 'angular2/src/common/forms';
import { isPresent, print } from 'angular2/src/facade/lang';
import { ExceptionHandler } from 'angular2/src/facade/exceptions';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { XHR } from 'angular2/src/compiler/xhr';
import { WebWorkerXHRImpl } from 'angular2/src/web_workers/worker/xhr_impl';
import { AppRootUrl } from 'angular2/src/compiler/app_root_url';
import { WebWorkerRenderer } from './renderer';
import { Renderer } from 'angular2/src/core/render/api';
import { ClientMessageBrokerFactory, ClientMessageBrokerFactory_ } from 'angular2/src/web_workers/shared/client_message_broker';
import { ServiceMessageBrokerFactory, ServiceMessageBrokerFactory_ } from 'angular2/src/web_workers/shared/service_message_broker';
import { MessageBus } from 'angular2/src/web_workers/shared/message_bus';
import { APPLICATION_COMMON_PROVIDERS, PLATFORM_COMMON_PROVIDERS } from 'angular2/core';
import * as core from 'angular2/core';
import { Serializer } from "angular2/src/web_workers/shared/serializer";
import { ON_WEB_WORKER } from "angular2/src/web_workers/shared/api";
import { RenderProtoViewRefStore } from 'angular2/src/web_workers/shared/render_proto_view_ref_store';
import { RenderViewWithFragmentsStore } from 'angular2/src/web_workers/shared/render_view_with_fragments_store';
import { ObservableWrapper } from 'angular2/src/facade/async';
import { SETUP_CHANNEL } from 'angular2/src/web_workers/shared/messaging_api';
import { WebWorkerEventDispatcher } from 'angular2/src/web_workers/worker/event_dispatcher';
import { COMPILER_PROVIDERS } from 'angular2/src/compiler/compiler';
/**
 * Initialize the Angular 'platform' on the page in a manner suitable for applications
 * running in a web worker. Applications running on a web worker do not have direct
 * access to DOM APIs.
 *
 * See {@link PlatformRef} for details on the Angular platform.
 *
 * ### Without specified providers
 *
 * If no providers are specified, `platform`'s behavior depends on whether an existing
 * platform exists:
 *
 * If no platform exists, a new one will be created with the default {@link platformProviders}.
 *
 * If a platform already exists, it will be returned (regardless of what providers it
 * was created with). This is a convenience feature, allowing for multiple applications
 * to be loaded into the same platform without awareness of each other.
 *
 * ### With specified providers
 *
 * It is also possible to specify providers to be made in the new platform. These providers
 * will be shared between all applications on the page. For example, an abstraction for
 * the browser cookie jar should be bound at the platform level, because there is only one
 * cookie jar regardless of how many applications on the age will be accessing it.
 *
 * If providers are specified directly, `platform` will create the Angular platform with
 * them if a platform did not exist already. If it did exist, however, an error will be
 * thrown.
 *
 * ### For Web Worker Applications
 *
 * This version of `platform` initializes Angular for use with applications
 * that do not directly touch the DOM, such as applications which run in a
 * web worker context. Applications that need direct access to the DOM should
 * use `platform` from `core/application_common` instead.
 */
export function platform(providers) {
    let platformProviders = isPresent(providers) ? [PLATFORM_COMMON_PROVIDERS, providers] : PLATFORM_COMMON_PROVIDERS;
    return core.platform(platformProviders);
}
class PrintLogger {
    constructor() {
        this.log = print;
        this.logError = print;
        this.logGroup = print;
    }
    logGroupEnd() { }
}
function webWorkerProviders(appComponentType, bus, initData) {
    return [
        COMPILER_PROVIDERS,
        Serializer,
        provide(MessageBus, { useValue: bus }),
        provide(ClientMessageBrokerFactory, { useClass: ClientMessageBrokerFactory_ }),
        provide(ServiceMessageBrokerFactory, { useClass: ServiceMessageBrokerFactory_ }),
        WebWorkerRenderer,
        provide(Renderer, { useExisting: WebWorkerRenderer }),
        provide(ON_WEB_WORKER, { useValue: true }),
        RenderViewWithFragmentsStore,
        RenderProtoViewRefStore,
        provide(ExceptionHandler, { useFactory: () => new ExceptionHandler(new PrintLogger()), deps: [] }),
        WebWorkerXHRImpl,
        provide(XHR, { useExisting: WebWorkerXHRImpl }),
        provide(AppRootUrl, { useValue: new AppRootUrl(initData['rootUrl']) }),
        WebWorkerEventDispatcher,
        FORM_PROVIDERS
    ];
}
export function bootstrapWebWorkerCommon(appComponentType, bus, appProviders = null) {
    var bootstrapProcess = PromiseWrapper.completer();
    var appPromise = platform().asyncApplication((zone) => {
        // TODO(rado): prepopulate template cache, so applications with only
        // index.html and main.js are possible.
        //
        bus.attachToZone(zone);
        bus.initChannel(SETUP_CHANNEL, false);
        var subscription;
        var emitter = bus.from(SETUP_CHANNEL);
        subscription = ObservableWrapper.subscribe(emitter, (message) => {
            var bindings = [APPLICATION_COMMON_PROVIDERS, webWorkerProviders(appComponentType, bus, message)];
            if (isPresent(appProviders)) {
                bindings.push(appProviders);
            }
            bootstrapProcess.resolve(bindings);
            ObservableWrapper.dispose(subscription);
        });
        ObservableWrapper.callEmit(bus.to(SETUP_CHANNEL), "ready");
        return bootstrapProcess.promise;
    });
    return PromiseWrapper.then(appPromise, (app) => app.bootstrap(appComponentType));
}
//# sourceMappingURL=application_common.js.map