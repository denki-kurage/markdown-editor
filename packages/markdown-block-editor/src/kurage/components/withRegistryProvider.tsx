import { compose, createHigherOrderComponent } from "@wordpress/compose";
import { createRegistry, RegistryProvider, useRegistry } from "@wordpress/data";
import { useState } from "@wordpress/element";
import { store, storeConfig } from "../store";


export type withRegistryProviderProps =
{
	storeName: string;
	storeConfig: any;
}

export const withRegistryProvider = createHigherOrderComponent(Wrapper => ({ storeName, storeConfig, ...props }: withRegistryProviderProps) => {
	const registry = useRegistry();
	const [subRegistries] = useState(() => new WeakMap());

	const subRegistry = subRegistries.get(registry) ?? (() => {
		const sr = createRegistry({}, registry);
		sr.registerStore(storeName, storeConfig);
		subRegistries.set(registry, sr);
		return sr;
	})();

	return (
		<RegistryProvider value={subRegistry}>
			<Wrapper {...props} />
		</RegistryProvider>
	)
}, 'withRegistryProvider')


export const withEditorRegistryProvider = createHigherOrderComponent(Wrapper => ({children, ...props}: any) => {
	//console.log("withEditorRegistryProvider")
	return (
		<Wrapper {...props} storeName={store.name} storeConfig={storeConfig}>
			{children}
		</Wrapper>
	)
}, 'withEditorRegistryProvider')

export const withEditorRegistryComponent = compose(
	withEditorRegistryProvider,
	withRegistryProvider,
);


