import { createRootRoute, Outlet } from '@tanstack/react-router'

const RootLayout = () => (
	<main className='min-h-screen bg-black text-white p-8 flex flex-col items-center space-y-4'>
		<Outlet />
	</main>
)

export const Route = createRootRoute({ component: RootLayout })
