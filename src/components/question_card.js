'use client';

import React, { use, useState } from 'react';
import { payloadBuilder as payload} from '@/helpers/payload_builder';
import axios from 'axios';
import { Card, CardActions, CardContent, Button, Typography, TextareaAutosize, ButtonGroup, CircularProgress } from '@mui/material';
import { Box } from '@mui/system';

const call_to_action = 'Send your answer';

const circle_index = (current_index, value, length) => {
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
    const [response, setResponse] = useState(call_to_action);
    const [previousAnswer, setPreviousAnswer] = useState('')

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
        setResponse(call_to_action);
    }


    const handleSubmit = (section, question, answer) => {

        if (answer === '') {
            setResponse("Please provide an answer before submitting.")
            return
        }

        

        const request_body = payload(section, question, answer);
        console.log(request_body);

        axios.post('/api/anthropic', request_body).then((res) => setResponse(res.data))

        setPreviousAnswer(answer);
        setAnswer('');
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
            <TextareaAutosize onChange={handleInputChange} value={answer} style={{width: '80vw', height: '20vh', p: 1}} placeholder='Write your answer'/>
            <ButtonGroup>
              <Button sx={{width: '40vh'}} type="submit" onClick={() => handleSubmit(section.section, section.questions[questionIndex], answer)}>Answer</Button>
              <Button sx={{width: '40vh'}} type="submit" onClick={() => handleSubmit(section.section, section.questions[questionIndex], `Don't know about ${section.questions[questionIndex]}, please explain to me.`)}>Don't know</Button>
            </ButtonGroup>
            
            </Box>
            <Box sx={{p: 2}}>
                {previousAnswer !== '' && <Typography variant='p' component='div' sx={{whiteSpace: 'pre-wrap'}}>Previous answer: {previousAnswer}</Typography>}
                { response === 'Processing your response...' && <CircularProgress /> }
                {response !== 'Processing your response...' &&  <Typography variant='p' component='div' sx={{p: 6, lineHeight: 2, whiteSpace: 'pre-wrap'}}>{response}</Typography>}
            </Box>
            <CardActions>
                <Button value={-1} type="submit" onClick={(e) => handleChangeQuestion(e.target.value)}>Previous Question</Button>
                <Button value={1} type="submit" onClick={(e) => handleChangeQuestion(e.target.value)}>Next Question</Button>
            </CardActions>
            </CardContent>
        </Card>

    );
}

export default QuestionCard;
