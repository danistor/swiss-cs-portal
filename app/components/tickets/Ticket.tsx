import type { Ticket } from "@prisma/client";
import { Link, Form } from "react-router";
import { buttonVariants } from "../ui/button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { useState } from "react";
import { TicketStatus, TicketPriority } from "@prisma/client";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

// Convert TicketStatus to an array
const ticketStatusArray = Object.values(TicketStatus);

export default function TicketDetails({ ticket }: { ticket: Ticket }) {
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold" id="ticket-title">{ticket.title}</h1>
      <div className="space-y-4">
        <div className="prose max-w-none" aria-label="Ticket description">
          {ticket.description}
        </div>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">{ticket.status}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Priority</dt>
            <dd className="mt-1">{ticket.priority}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1">{new Date(ticket.createdAt).toLocaleString()}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd className="mt-1">{new Date(ticket.updatedAt).toLocaleString()}</dd>
          </div>
        </dl>

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Created By</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1">{ticket.creator.firstName} {ticket.creator.lastName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1">{ticket.creator.email}</dd>
            </div>
          </div>
        </div>

        {ticket?.assignee && (
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Assigned To</h2>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1">{ticket.assignee.firstName} {ticket.assignee.lastName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1">{ticket.assignee.email}</dd>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function MyTicketsList({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="flex flex-col gap-4">
      {tickets.map((ticket: Ticket) => (
        <div key={ticket.id} className="flex flex-row items-center">
          <div className="text-blue-500">{ticket.title}</div>
          <Link className={`${buttonVariants({ variant: "outline" })} ml-4`} to={`/tickets/id/${ticket.id}`}>View</Link>
        </div>
      ))}
    </div>
  );
}

export function TicketForm({ ticket, cancelAction }: { ticket: Ticket, cancelAction: () => void }) {
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | null>(
    ticket.status
  );
  const [selectedAssignee, setSelectedAssignee] = useState(ticket.assigneeId || "");

  // Build the list of potential assignees
  const assignees = [
    { id: ticket.creatorId, name: `${ticket.creator.firstName} ${ticket.creator.lastName}` },
    ...(ticket.assigneeId ? [{ id: ticket.assigneeId, name: `${ticket.assignee.firstName} ${ticket.assignee.lastName}` }] : [])
  ];
  // Remove duplicates based on ID
  const uniqueAssignees = Array.from(new Map(assignees.map(item => [item.id, item])).values());

  return (
    <Form method="post" key={ticket.id} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input type="text" id="title" name="title" defaultValue={ticket.title} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Input type="text" id="description" name="description" defaultValue={ticket.description} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="priority">Priority</Label>
        <Input type="text" id="priority" name="priority" defaultValue={ticket.priority} />
      </div>

      {/* Hidden input to store the selected status */}
      <input type="hidden" name="status" value={selectedStatus || ""} />
      <div className="flex items-center space-x-4">
        <p className="text-sm text-muted-foreground">Status</p>
        <Popover open={openStatus} onOpenChange={setOpenStatus}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-[150px] justify-start"
            >
              {selectedStatus ? (
                <>{selectedStatus}</>
              ) : (
                <>+ Set status</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="right" align="start">
            <Command>
              <CommandInput />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {ticketStatusArray.map((status) => (
                    <CommandItem
                      key={status}
                      value={status}
                      onSelect={(value: TicketStatus) => {
                        setSelectedStatus(value)
                        setOpenStatus(false)
                      }}
                    >
                      <span>{status}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center space-x-4">
        <Label htmlFor="assigneeId">Asignee</Label>
        <Input type="hidden" name="assigneeId" value={selectedAssignee} />
        <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>{assignees.find(assignee => assignee.id === selectedAssignee)?.name || "Assign to..."}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {uniqueAssignees.map((assignee) => (
                <SelectItem key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">Save</Button>
      <Button onClick={cancelAction} variant="destructive">Cancel</Button>
    </Form>
  )
}
