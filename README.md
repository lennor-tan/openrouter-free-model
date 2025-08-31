# OpenRouter Free Model Explorer

[**English**](./README.md) | [**中文**](./README.zh.md)

---

This is a web application designed to browse, filter, sort, and manage free models available on OpenRouter. It allows users to easily select models and copy their IDs in various formats compatible with other tools. The application is built with Next.js and supports multiple languages (English and Chinese).

## Features

- **Model Browsing:** View a list of all free models from the OpenRouter API.
- **Filtering:** Filter models by company and provider.
- **Sorting:** Sort models by name, context length, etc.
- **Search:** Search for models by name.
- **Batch Selection:** Select multiple models, with options for "Select All," "Deselect All," and "Invert Selection".
- **Reasoning Models Filter:** Option to display only models that support reasoning.
- **Copy IDs:** Easily copy the IDs of selected models.
- **Multi-language Support:** Switch between English and Chinese.
- **Responsive Design:** The interface is optimized for both desktop and mobile devices.

## Copy Formats

The application supports copying selected model IDs in two different formats, compatible with `NewAPI` and `UniAPI`.

### NewAPI Format

- **Model Name :** A comma-separated list of model names, ideal for quick lists.
- **Model Mapping (JSON):** A JSON object that maps a custom name to the original OpenRouter model ID. This is useful for creating aliases.

### UniAPI Format

- **YAML List:** A YAML-style list. If mapping is enabled, it's formatted as `original-id: mapped-name`; otherwise, it's just the `original-id`.

### Customization

Both formats can be customized with the following mapping options:

- **Prefix:** Add a custom prefix to model names.
- **Strip `:free` Suffix:** Remove the `:free` suffix from the model ID.
- **Strip Company Name:** Remove the company name (e.g., `google/`) from the model ID.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (built on Radix UI)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Internationalization (i18n):** [next-intl](https://next-intl-docs.vercel.app/)
- **Data Fetching:** [SWR](https://swr.vercel.app/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Code Quality:** TypeScript, ESLint, Prettier

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or higher)
- [pnpm](https://pnpm.io/) (or your package manager of choice)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/openrouter-free-model.git
    cd openrouter-free-model
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```

### Running the Development Server

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

- `app/[lang]/`: Dynamic routes for internationalization.
- `app/api/`: API routes.
- `components/`: React components.
- `hooks/`: Custom React hooks.
- `lib/`: Utility functions.
- `messages/`: Language files for i18n.
- `public/`: Static assets.
- `types/`: TypeScript type definitions.
