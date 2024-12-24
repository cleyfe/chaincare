import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type Project, type Distribution } from "@db/schema";

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    initialData: []
  });

  const { data: distributions } = useQuery<Distribution[]>({
    queryKey: ["/api/distributions"],
    initialData: []
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Humanitarian Projects</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card 
            key={project.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedProject(project)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{project.name}</CardTitle>
                <Badge variant={project.status === "active" ? "default" : "secondary"}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {project.description}
              </p>
              <div className="space-y-2">
                <Progress 
                  value={(parseFloat(project.raisedAmount) / parseFloat(project.targetAmount)) * 100}
                  className="h-2"
                />
                <div className="flex justify-between text-sm">
                  <span>{parseFloat(project.raisedAmount)} ETH raised</span>
                  <span className="text-muted-foreground">
                    Target: {parseFloat(project.targetAmount)} ETH
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.name}</DialogTitle>
                <DialogDescription>
                  Project details and distribution history
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedProject.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Distribution History</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {distributions
                        .filter((d) => d.projectId === selectedProject.id)
                        .map((distribution) => (
                          <TableRow key={distribution.id}>
                            <TableCell>
                              {new Date(distribution.timestamp).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{parseFloat(distribution.amount)} ETH</TableCell>
                            <TableCell className="font-mono text-sm">
                              {distribution.recipientAddress.slice(0, 6)}...
                              {distribution.recipientAddress.slice(-4)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={distribution.status === "completed" ? "default" : "secondary"}>
                                {distribution.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}