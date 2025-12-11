"""Key Point Extraction Task"""

from .base import AITask, TaskInput, TaskOutput
import structlog

logger = structlog.get_logger(__name__)


class ExtractTask(AITask):
    """Extracts key points, named entities, or structured data from text"""

    async def execute(self, input_data: TaskInput) -> TaskOutput:
        """Extract key information from text"""
        try:
            text = input_data.data
            extract_type = input_data.metadata.get("type", "keypoints")

            # TODO: Use LLM or NLP library for real extraction
            # For now: naive extraction (split by sentences)
            sentences = text.split(". ")
            keypoints = [s.strip() for s in sentences[:5] if s.strip()]

            self._log_execution("ExtractTask", "success", {"type": extract_type})

            return TaskOutput(
                result={
                    "type": extract_type,
                    "extracted": keypoints,
                    "count": len(keypoints),
                },
                status="success",
            )
        except Exception as e:
            logger.error("extract_task_failed", error=str(e))
            return TaskOutput(
                result={},
                status="error",
                error=str(e),
            )
