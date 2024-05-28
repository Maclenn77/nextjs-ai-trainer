export const payloadBuilder = (section, question, answer) => {
    return {
        model: "claude-3-opus-20240229",
        max_tokens: 2000,
        system: "You're a Databricks Trainer. You evaluate if the user's knowledge of Databricks is correct, partially correct, or incorrect. You can also provide feedback to the user and show them how to improve. Provide an explanation if user don't know the answer.",
        messages: [
            {
                role: "user",
                content: `Evaluate my knowledge of Databricks in ${section}.`
            },
            {
                role: "assistant",
                content: `Sure, answer this question: ${question}`                },
            {
                role: "user",
                content: answer
            }
        ]
    }
}