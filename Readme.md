cdProject Description

Goal: Your goal is to create a website that mental health counselors can use when they need some guidance on how to best help a patient.

Reminder: This is a POC, not a fully fledged production level project.

To accomplish this goal, you are recommended to carry out the following steps:
Pull a dataset of mental health counseling transcripts (see suggested resources below). Optional: store this data in a database.
Conduct an analysis of the data to understand how it might be helpful for your intended use-case (the website)
Decide on a numeric or categorical piece of information that you can infer or predict using the dataset you have. Build an ML model to predict this piece of information based on some input. Some examples of what the piece of information could be (note: these are just ideas, and may not be possible to do with the dataset you have chosen)
Likelihood for a patient to present with a particular problem, given certain information about the patient
Expected “response type” from a provider (e.g. contains direct advice vs. no direct advice), given a particular patient problem
Build an LLM-based application that can take in free-text from the user (a mental health counselor), and then surface generated text that contains advice on how to best help the patient. You can use a closed-source API such as OpenAI (do not spend more than $10), or by running a model locally.
Build a web application with ONE of these three features:
1. Users can search a database that contains the mental health counseling data, and retrieve examples that are most relevant to their search terms
2. Users can input information about their patient, invoke your ML model with this input, and then the numeric or categorical piece of information (the output of the ML) is surfaced to them
3. Users can enter free-text that describes the challenge they are facing with a particular patient, invoke the LLM using the user’s input, and return a suggestion to the user on how to best help the patient


Suggested Resources for Data:
https://as3eem.medium.com/5-must-know-mental-health-counseling-datasets-for-ai-research-dd1a1b9f30b4
https://www.kaggle.com/datasets/thedevastator/nlp-mental-health-conversations/data


Skills being evaluated: data analysis, data engineering, ML engineering/MLOps, software engineering, product thinking
