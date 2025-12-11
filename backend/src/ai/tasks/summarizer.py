"""Document Summarization Task"""

from .base import AITask, TaskInput, TaskOutput
import structlog

logger = structlog.get_logger(__name__)


class SummarizeTask(AITask):
    """Summarizes documents or long texts"""

    async def execute(self, input_data: TaskInput) -> TaskOutput:
        """Summarize input text"""
        try:
            text = input_data.data
            max_length = input_data.metadata.get("max_length", 200)

            # TODO: Replace with actual LLM call
            # For now: naive summary (first N sentences)
            sentences = text.split(". ")
            summary = ". ".join(sentences[:3]) + "."

            self._log_execution("SummarizeTask", "success")

            return TaskOutput(
                result={
                    "original_length": len(text),
                    "summary_length": len(summary),
                    "summary": summary,
                },
                status="success",
            )
        except Exception as e:
            logger.error("summarize_task_failed", error=str(e))
            return TaskOutput(
                result={},
                status="error",
                error=str(e),
            )
