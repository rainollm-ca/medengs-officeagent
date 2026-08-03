import type { ClinicOperatingProfile, ClinicProfileReadiness } from './domain';

export function getProfileReadiness(profile: ClinicOperatingProfile): ClinicProfileReadiness {
  const enabledChannelCount = profile.channels.filter((channel) => channel.enabled).length;
  const enabledWorkflowCount = profile.workflows.filter((workflow) => workflow.enabled).length;
  const blockers: string[] = [];

  if (!profile.channels.some((channel) => channel.key === 'phone' && channel.enabled)) {
    blockers.push('Phone channel is not enabled.');
  }

  if (!profile.workflows.some((workflow) => workflow.key === 'new_patient_intake' && workflow.enabled)) {
    blockers.push('New patient intake workflow is not enabled.');
  }

  if (profile.approvalPolicy.pmsWrites !== 'disabled') {
    blockers.push('PMS writes need a staff-reviewed integration contract before pilot use.');
  }

  blockers.push('Billing is not configured yet.');
  blockers.push('Database-backed persistence is not enabled yet.');

  return { enabledChannelCount, enabledWorkflowCount, blockers };
}
