'use client';

import React, { useState } from 'react';
import useSWR from 'swr';

const anthropic_url = 'https://api.anthropic.com/v1/messages';

const fetcher = (url) => fetch(url).then((res) => res.json());


const QuestionCard = ({ data }) => {
    const [section, setSection] = useState(data[0]);
    const [question, setQuestion] = useState(section.questions[0]);
    const [answer, setAnswer] = useState('');
    const [response, setResponse] = useState('');

    const handleInputChange = (event) => {
        setAnswer(event.target.value);
    }

    const handleSubmit = (questionId) => {
        const { data, error } = useSWR(anthropic_url, fetcher);

        if (error) console.error(error);
        if (data) setResponse(data);
    }

    return (
        <div>
                <div key={section.id}>
                    <h2>{section.section}</h2>
                        <div key={1}>
                            <p>{question}</p>
                            <input type="text" onChange={handleInputChange} />
                            <button onClick={() => handleSubmit(section.id)}>Submit</button>
                            <p>{"Side for a response"}</p>
                        </div>
                </div>
        </div>
    );
}

export default QuestionCard;
