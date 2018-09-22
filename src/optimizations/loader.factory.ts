import { KeyValueMatchFunction, Loader, LoaderFunction } from './loader'
import { LoaderQueue } from './queue'
import { EventLoopScheduler } from './scheduler'

const scheduler = new EventLoopScheduler()

export const createDefault = <K, V>(
    loader: LoaderFunction<K, V>,
    match: KeyValueMatchFunction<K, V>,
): Loader<K, V> => {
    const batch = new LoaderQueue<K, V>()
    return new Loader<K, V>({ scheduler, match, batch, loader })
}
