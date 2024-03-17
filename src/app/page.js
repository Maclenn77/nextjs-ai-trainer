'use client'
import Image from "next/image";
import styles from "./page.module.css";
import QuestionCard from "@/components/question_card";
import useSWR from "swr";
import { Typography } from "@mui/material";

export default function Home() {

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR("/api/questions", fetcher);

  if (error) return <div>Failed to load</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <main className={styles.main}>
      <Typography variant="h1">Databricks Trainer</Typography>
      <QuestionCard data={data} />
    </main>
  );
}
