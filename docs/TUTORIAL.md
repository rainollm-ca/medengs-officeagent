# Tutorial — Running MedEngs OfficeAgent

## Local setup
```bash
cd projects/medengs-officeagent
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Build check
```bash
npm run typecheck
npm run build
```

## First clinic onboarding flow
1. Create clinic account.
2. Add clinic name, logo, colors, destination email.
3. Import patient CSV or add patient manually.
4. Choose a form template.
5. Generate patient link.
6. Patient completes form.
7. Review generated PDF and flags in clinic inbox.
8. Store PDF in clinic cloud folder.

## Minimal maintenance rules
- Keep integrations optional and isolated.
- Prefer email/cloud export over PMS write-back.
- Add one connector at a time.
- No secrets in repo.
- Run build before deploy.
- Keep patient data out of logs.
