"""Base AI Task class"""

from abc import ABC, abstractmethod
from pydantic import BaseModel
from typing import Any, Dict
import structlog

logger = structlog.get_logger(__name__)


class TaskInput(BaseModel):
    """Base input for AI tasks"""
    data: str
    metadata: Dict[str, Any] = {}


class TaskOutput(BaseModel):
    """Base output for AI tasks"""
    result: Dict[str, Any]
    status: str = "success"
    error: str = None


class AITask(ABC):
    """Base class for all AI tasks"""

    @abstractmethod
    async def execute(self, input_data: TaskInput) -> TaskOutput:
        """Execute the task"""
        pass

    def _log_execution(self, task_name: str, status: str, metadata: Dict = None):
        """Log task execution"""
        logger.info(
            "task_executed",
            task=task_name,
            status=status,
            metadata=metadata or {},
        )
