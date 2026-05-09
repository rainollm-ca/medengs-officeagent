import { z } from 'zod';

export const clinicRoleSchema = z.enum(['owner', 'manager', 'receptionist', 'clinician', 'auditor']);
export const taskPrioritySchema = z.enum(['low', 'medium', 'high']);

export const createAgentTaskSchema = z.object({
  title: z.string().trim().min(3).max(180),
  ownerRole: clinicRoleSchema,
  priority: taskPrioritySchema.default('medium'),
  patientChart: z
    .string()
    .trim()
    .regex(/^[A-Z0-9-]{2,32}$/i, 'patientChart must be a clinic chart identifier')
    .optional(),
  requiresHumanApproval: z.boolean().default(true),
});

export type CreateAgentTaskInput = z.infer<typeof createAgentTaskSchema>;

export function parseCreateAgentTask(input: unknown): CreateAgentTaskInput {
  return createAgentTaskSchema.parse(input);
}
