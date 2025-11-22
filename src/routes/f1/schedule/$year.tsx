import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
	fetchSchedule,
	formatDateRange,
	getRoundNumber,
	sortByDate,
	type Meeting,
} from '@/lib/openf1'

export const Route = createFileRoute('/f1/schedule/$year')({
	component: RouteComponent,
})

function RouteComponent() {
	const { year } = Route.useParams()

	const [meetings, setMeetings] = useState<Meeting[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadSchedule = async () => {
			try {
				setLoading(true)
				setError(null)
				const data = await fetchSchedule(Number(year))
				const sorted = sortByDate(data)
				setMeetings(sorted)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load schedule')
				setMeetings([])
			} finally {
				setLoading(false)
			}
		}

		loadSchedule()
	}, [])

	return (
		<>
			<h1 className="font-semibold text-xl">Formula 1 - {year} Schedule</h1>

			{loading && <p className="text-gray-400">Loading schedule...</p>}

			{error && <p className="text-red-400">Error: {error}</p>}

			{
				!loading && !error && meetings.length === 0 && (
					<p className="text-gray-400">No races found</p>
				)
			}

			{
				!loading && !error && meetings.length > 0 && (
					<div className="grid gap-2 w-full max-w-xl mx-auto" style={{ gridTemplateColumns: '18rem 8rem 120px' }}>
						{meetings.map((meeting) => (
							<ScheduleListItem
								key={meeting.meeting_key}
								round={getRoundNumber(meetings, meeting)}
								meeting={meeting}
							/>
						))}
					</div>
				)
			}
		</>
	)
}

interface ScheduleListItemProps {
	round: number
	meeting: Meeting
}

function ScheduleListItem({ round, meeting }: ScheduleListItemProps) {
	return (
		<>
			<span className='text-left'>
				<b>Round {round}: </b>
				<span>{meeting.circuit_short_name}</span>
			</span>
			<span className="text-left text-xs text-gray-500">{formatDateRange(meeting.date_start)}</span>
			<button className="text-blue-400">View Round</button>
		</>
	)
}
