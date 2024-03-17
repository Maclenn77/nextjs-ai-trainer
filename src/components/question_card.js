'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardActions, CardContent, Button, Typography, TextareaAutosize, ButtonGroup, CircularProgress } from '@mui/material';
import { Box } from '@mui/system';

const anthropic_url = 'https://api.anthropic.com/v1/messages';

const circle_index = (current_index, value, length) => {
    console.log(length)
    let next_index = current_index + parseInt(value);
    if (current_index + parseInt(value) < 0 ) {
        next_index = length - 1;
    } else if (current_index + parseInt(value) > length - 1) {
        next_index = 0;
    }

    return next_index;
}


const QuestionCard = ({ data }) => {
    const [section, setSection] = useState(data[0]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [response, setResponse] = useState('Send your answer to see the response.');

    const handleInputChange = (event) => {
        setAnswer(event.target.value);
    }

    const handleChangeSection = (value) => {
        const current_index = section.id - 1;
        let next_index = circle_index(current_index, value, data.length);

        setSection(data[next_index]);
    }

    const handleChangeQuestion = (value) => {
        let next_index = circle_index(questionIndex, value, section.questions.length);

        setQuestionIndex(next_index);
    }


    const handleSubmit = (section, question, answer) => {
        const payload = {
            model: "claude-3-opus-20240229",
            max_tokens: 2000,
            messages: [
                {
                    role: "user",
                    content: `Evaluate my knowledge of Databricks in ${section}.`
                },
                {
                    role: "assistant",
                    content: question
                },
                {
                    role: "user",
                    content: answer
                }
            ]
        }

        if (answer === '') {
            setResponse("Please provide an answer before submitting.")
            return
        }

        const api_response = axios.post('/api/anthropic', payload).then((res) => setResponse(res.data))

        setResponse("Processing your response...")
    }

    return (
        <Card sx={{minWidth: 350}} key={section.id}> 
            <CardContent>
            <Typography variant="h2" component="div">{section.section}</Typography>
            <CardActions>
                <ButtonGroup>
                    <Button value={-1} type="submit" onClick={(e) => handleChangeSection(e.target.value)}>Back</Button>
                    <Button value={1} type="submit" onClick={(e) => handleChangeSection(e.target.value)}>Forward</Button>
                </ButtonGroup>

            </CardActions>
            <Typography variant='p' component='div' sx={{p: 2}}>{section.questions[questionIndex]}</Typography>
            <Box sx={{minWidth: 350, p: 2}}>
            <TextareaAutosize onChange={handleInputChange} style={{width: '80vw', height: '20vh', p: 1}} placeholder='Write your answer'/>
            <Button sx={{width: '80vh', alignContent: 'center'}} type="submit" onClick={() => handleSubmit(section.section, section.questions[questionIndex], answer)}>Submit</Button>
            </Box>
            { response === 'Processing your response...' && <CircularProgress /> }
            { response !== 'Processing your response...' &&  <Typography variant='p' component='div' sx={{p: 6, lineHeight: 2, whiteSpace: 'pre-wrap'}}>{response}</Typography> }
            <CardActions>
                <Button value={-1} type="submit" onClick={(e) => handleChangeQuestion(e.target.value)}>Previous Question</Button>
                <Button value={1} type="submit" onClick={(e) => handleChangeQuestion(e.target.value)}>Next Question</Button>
            </CardActions>
            </CardContent>
                    

        </Card>

    );
}

export default QuestionCard;
