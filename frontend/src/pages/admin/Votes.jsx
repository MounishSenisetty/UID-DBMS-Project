import { useState, useEffect } from 'react'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import api from '../../services/api'

const Votes = () => {
  const [voteCounts, setVoteCounts] = useState([])
  const [winner, setWinner] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVoteCounts()
  }, [])

  const fetchVoteCounts = async () => {
    setLoading(true)
    try {
      const response = await api.get('/votes/count')
      setVoteCounts(response.data.voteCounts)
      setWinner(response.data.winner)
    } catch (error) {
      console.error('Error fetching vote counts:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      header: 'Candidate',
      accessor: 'Candidate.name',
      render: (row) => row.Candidate?.name || '',
    },
    {
      header: 'Party',
      accessor: 'Candidate.Party.name',
      render: (row) => row.Candidate?.Party?.name || '',
    },
    {
      header: 'Vote Count',
      accessor: 'dataValues.voteCount',
      render: (row) => row.dataValues?.voteCount || 0,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Vote Counts</h2>
        {winner && (
          <p className="mt-2 text-lg font-semibold text-green-600">
            Leading Candidate: {winner.Candidate?.name} ({winner.Candidate?.Party?.name}) with {winner.dataValues?.voteCount} votes
          </p>
        )}
      </div>

      <Card>
        <Table columns={columns} data={voteCounts} isLoading={loading} />
      </Card>
    </div>
  )
}

export default Votes
