import axios from 'axios';
import { marked } from 'marked';
import React, { useEffect } from 'react';
import { parsePractices, withId } from '../../practice-parser/lexer';
import { Practices } from '../../components/practices/practices';
import { isEmptyPractices, usePracticesWithLocalStorage } from '../../components/practices/practices.hook';
import { convertGithubLink, recorrectQuestionIndex } from './utils';

interface GithubPracticesProps {
  githubLink: string;
}

const GithubPractices: React.FC<GithubPracticesProps> = ({ githubLink }) => {
  const link = convertGithubLink(githubLink);
  const getPractices = () => axios.get(link);// get interview questions as markdown
    .then((response) => {
      const lexer = marked.lexer(response.data); // convert question as markdown lexer
      const practices = recorrectQuestionIndex(parsePractices(lexer)); // get array of questions from markdown
      return withId(practices);
    });

  const [practices, {
    handleSubmit,
    handleSelectionChange,
    setPractices,
    resetStorage,
  }] = usePracticesWithLocalStorage(link, {}); // custom hook to load parctise from local storage

  useEffect(() => {
    // chock of practs not present in local storage
    if (isEmptyPractices(practices)) {
      getPractices().then((data) => {
        setPractices(data);
      });
    }
  }, [practices]);

  return (
    <Practices
      data={practices}
      onSubmit={handleSubmit}
      onSelectionChange={handleSelectionChange}
      baseImageURL={link}
      onResetPractices={resetStorage}
    />
  );
};

export default GithubPractices;
