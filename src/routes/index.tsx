import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: Index,
})

function Index() {
	return (
		<>
			<h1 className='font-semibold text-xl'>What's the Score?</h1>
			<Link to='/f1/schedule/$year' params={{ year: '2025' }} className='text-blue-400'>Formula One</Link>
		</>
	)
}
