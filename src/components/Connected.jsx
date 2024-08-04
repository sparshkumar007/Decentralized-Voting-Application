import React, { useEffect } from 'react'

const Connected = (props) => {
    useEffect(() => {
        console.log(props.voteStatus)
    }, [])
    return (
        <div className='connected-container'>
            <h1 className='connected-header'>Connected to metamask wallet</h1>
            <p className='connected-account'>metamask address + {props.account}</p>
            <p className='connected-account'>Remaining time to vote : {props.remainingTime} seconds</p>


            <input type='number' placeholder='Enter candidate index' value={props.number} onChange={props.handleChangeNumber} />
            voteStatus: {props.voteStatus}
            {props.votingStatus ? props.voteStatus ? <button className='login-button' onClick={props.voteFunction}>Vote</button> : <p className='voting-done'>You have already Voted</p> : <p className='voting-closed'>Voting closed</p>}


            <table id="mytable" className='candidates-table'>
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Name</th>
                        <th>Votes</th>
                    </tr>
                </thead>
                <tbody>
                    {props.candidates.map(candidate => {
                        return (
                            <tr key={candidate.index}>
                                <td>{candidate.index}</td>
                                <td>{candidate.name}</td>
                                <td>{candidate.voteCount}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Connected