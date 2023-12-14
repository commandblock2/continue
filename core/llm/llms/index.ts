import { BaseLLM } from "..";
import { BaseCompletionOptions, LLMOptions, ModelDescription } from "../..";
import Anthropic from "./Anthropic";
import FreeTrial from "./FreeTrial";
import Gemini from "./Gemini";
import GooglePalm from "./GooglePalm";
import GooglePalmProxy from "./GooglePalmProxy";
import HuggingFaceInferenceAPI from "./HuggingFaceInferenceAPI";
import HuggingFaceTGI from "./HuggingFaceTGI";
import LMStudio from "./LMStudio";
import LlamaCpp from "./LlamaCpp";
import Llamafile from "./Llamafile";
import Ollama from "./Ollama";
import OpenAI from "./OpenAI";
import Replicate from "./Replicate";
import TextGenWebUI from "./TextGenWebUI";
import Together from "./Together";

const LLMs = [
  Anthropic,
  FreeTrial,
  GooglePalmProxy, // TODO: Hacky fix for now bc of proxy details
  GooglePalm,
  Llamafile,
  Ollama,
  Replicate,
  TextGenWebUI,
  Together,
  HuggingFaceTGI,
  HuggingFaceInferenceAPI,
  LlamaCpp,
  OpenAI,
  LMStudio,
  Gemini,
];

export function llmFromDescription(
  desc: ModelDescription,
  completionOptions?: BaseCompletionOptions
): BaseLLM | undefined {
  const cls = LLMs.find((llm) => llm.providerName === desc.provider);

  if (!cls) {
    return undefined;
  }

  const finalCompletionOptions = {
    ...completionOptions,
    ...desc.completionOptions,
  };

  const options: LLMOptions = {
    ...desc,
    completionOptions: {
      ...finalCompletionOptions,
      model: desc.model || cls.defaultOptions?.model || "codellama-7b", // TODO: Fix up all the ?'s
      maxTokens:
        finalCompletionOptions.maxTokens ||
        cls.defaultOptions?.completionOptions?.maxTokens ||
        1024,
    },
  };

  return new cls(options);
}