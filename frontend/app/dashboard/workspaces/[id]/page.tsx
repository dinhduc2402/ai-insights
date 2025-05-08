"use client"
import React from 'react';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const WorkspacePage = () => {
     const params = useParams();
     const workspaceId = params.id;
     const [workspace, setWorkspace] = useState<{ id: string; name: string; description?: string } | null>(null);
     const [jobs, setJobs] = useState<Array<{ id: string; name: string; description?: string; status: string }>>([]);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          const loadData = async () => {
               try {
                    const wsResponse = await api.get<{ data: any }>(`/api/workspaces/${workspaceId}`);
                    setWorkspace(wsResponse.data.data);
                    const jobsResponse = await api.get<Array<{ id: string; name: string; description?: string; status: string }>>(`/api/jobs?workspace_id=${workspaceId}`);
                    setJobs(jobsResponse.data);
               } catch (error) {
                    console.error("Error loading workspace or jobs:", error);
               } finally {
                    setIsLoading(false);
               }
          };
          loadData();
     }, [workspaceId]);

     if (isLoading) {
          return <div className="text-center py-8">Loading...</div>;
     }

     return (
          <div className="container py-8">
               <div className="mb-6">
                    <h1 className="text-3xl font-bold">{workspace?.name}</h1>
                    {workspace?.description && (
                         <p className="text-muted-foreground mt-2">{workspace.description}</p>
                    )}
               </div>
               {jobs.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                         {jobs.map(job => (
                              <Card key={job.id} className="hover:shadow-md">
                                   <CardHeader>
                                        <CardTitle>{job.name}</CardTitle>
                                   </CardHeader>
                                   <CardContent>
                                        {job.description && <p className="text-sm text-muted-foreground">{job.description}</p>}
                                        <p className="text-xs text-muted-foreground mt-2">Status: {job.status}</p>
                                   </CardContent>
                              </Card>
                         ))}
                    </div>
               ) : (
                    <div className="text-center py-8">No jobs found for this workspace.</div>
               )}
          </div>
     );
};

export default WorkspacePage;
