import {
	memo,
	type ComponentType,
	type CSSProperties,
	type ReactNode,
} from 'react';

export type LoadingProps = {
	isLoading: boolean;
};

type LoadingPanelProps = LoadingProps & {
	children: ReactNode;
	LoadingComponent?: ComponentType< LoadingProps >;
};

const loadingAnimationStyles =
	'@keyframes markdown-block-editor-loading-spin { to { transform: rotate(360deg); } }';

const overlayStyle: CSSProperties = {
	position: 'absolute',
	inset: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
};

export const LoadingOverlay = ( { children }: { children: ReactNode } ) => (
	<>
		<div
			aria-hidden="true"
			style={ {
				...overlayStyle,
				backgroundColor: 'white',
				opacity: 0.5,
			} }
		/>
		<div
			role="status"
			aria-label="Loading"
			style={ {
				...overlayStyle,
				textAlign: 'center',
			} }
		>
			{ children }
		</div>
	</>
);

const NativeLoadingSpinner = () => (
	<>
		<span
			aria-hidden="true"
			style={ {
				width: 64,
				height: 64,
				border: '6px solid #dcdcde',
				borderTopColor: '#2271b1',
				borderRadius: '50%',
				animation:
					'markdown-block-editor-loading-spin 0.8s linear infinite',
			} }
		/>
		<style>{ loadingAnimationStyles }</style>
	</>
);

export const DefaultLoading = ( { isLoading }: LoadingProps ) => {
	if ( ! isLoading ) {
		return null;
	}

	return (
		<LoadingOverlay>
			<NativeLoadingSpinner />
		</LoadingOverlay>
	);
};

export const LoadingPanel = memo(
	( {
		isLoading,
		children,
		LoadingComponent = DefaultLoading,
	}: LoadingPanelProps ) => (
		<div style={ { position: 'relative' } }>
			{ children }
			<LoadingComponent isLoading={ isLoading } />
		</div>
	)
);
