import { log, warn, retry, timeoutPromise } from "./utils/promise-helpers.js";
import { takeUntil, debounceTime, partialize, pipe } from "./utils/operators.js";
import './utils/array-helpers.js';
import { notasService as service } from "./nota/service.js";
import { EventEmitter } from './utils/event-emitter.js';

const operations = pipe(
    partialize(takeUntil, 3),
    partialize(debounceTime, 500)
);

const action = operations(() =>
    retry(3, 1000, () => timeoutPromise(200, service.sumItems('2143')))
    .then(total => EventEmitter.emit("itensTotalizados", total))
    .catch(warn)
);

document
    .querySelector('#myButton')
    .onclick = action;