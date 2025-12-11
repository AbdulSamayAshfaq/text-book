"""Policy Bot Task - Answer policy/HR questions using knowledge base"""

from .base import AITask, TaskInput, TaskOutput
import structlog

logger = structlog.get_logger(__name__)


class PolicyTask(AITask):
    """Answers policy, HR, and company rule questions"""

    async def execute(self, input_data: TaskInput) -> TaskOutput:
        """Answer policy question"""
        try:
            question = input_data.data
            policy_domain = input_data.metadata.get("domain", "general")

            # TODO: Integrate with policy knowledge base / RAG
            
            answer = {
                "question": question,
                "domain": policy_domain,
                "answer": "See company handbook for details",
                "sources": [],
                "confidence": 0.7,
            }

            self._log_execution("PolicyTask", "success", {"domain": policy_domain})

            return TaskOutput(
                result=answer,
                status="success",
            )
        except Exception as e:
            logger.error("policy_task_failed", error=str(e))
            return TaskOutput(
                result={},
                status="error",
                error=str(e),
            )
