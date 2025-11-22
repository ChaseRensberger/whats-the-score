import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
	fetchSession,
	fetchResults,
	fetchDrivers,
	type Result,
	type Driver,
} from '@/lib/openf1'

export const Route = createFileRoute('/f1/results/$meetingId')({
	component: RouteComponent,
})

function RouteComponent() {
	const { meetingId } = Route.useParams()

	const [results, setResults] = useState<Result[]>([])
	const [drivers, setDrivers] = useState<Map<number, Driver>>(new Map())
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadResults = async () => {
			try {
				setLoading(true)
				setError(null)

				const session = await fetchSession(Number(meetingId))

				const resultsData = await fetchResults(session.session_key)
				setResults(resultsData)

				const driversData = await fetchDrivers(session.session_key)
				const driversMap = new Map(
					driversData.map((driver) => [driver.driver_number, driver]),
				)
				setDrivers(driversMap)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load results')
				setResults([])
				setDrivers(new Map())
			} finally {
				setLoading(false)
			}
		}

		loadResults()
	}, [meetingId])

	return (
		<>
			<h1 className="font-semibold text-xl">Race Results</h1>

			{loading && <p className="text-gray-400">Loading results...</p>}

			{error && <p className="text-red-400">Error: {error}</p>}

			{
				!loading && !error && results.length === 0 && (
					<p className="text-gray-400">No results found</p>
				)
			}

			{
				!loading && !error && results.length > 0 && (
					<div className="grid gap-2 w-full max-w-md mx-auto" style={{ gridTemplateColumns: '60px 1fr' }}>
						{results.map((result) => {
							const driver = drivers.get(result.driver_number)
							return (
								<ResultsListItem
									key={result.driver_number}
									result={result}
									driver={driver}
								/>
							)
						})}
					</div>
				)
			}
		</>
	)
}

interface ResultsListItemProps {
	result: Result
	driver: Driver | undefined
}

function ResultsListItem({ result, driver }: ResultsListItemProps) {
	return (
		<>
			<span className="font-bold text-center text-lg">{result.position}</span>
			<span className="text-left">
				{driver ? `${driver.first_name} ${driver.last_name}` : `Driver #${result.driver_number}`}
			</span>
		</>
	)
}
