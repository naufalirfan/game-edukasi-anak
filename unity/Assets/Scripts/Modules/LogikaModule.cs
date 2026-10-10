using UnityEngine;

namespace MAS.GameEdukasi
{
    /// <summary>Logika module: counting, sorting, puzzles. TODO: level data ScriptableObjects.</summary>
    public class LogikaModule : MonoBehaviour
    {
        [SerializeField] int currentLevel = 1;
        public int CurrentLevel => currentLevel;
        public string ModuleId => "logika";

        public void StartLevel(int level)
        {
            currentLevel = Mathf.Clamp(level, 1, 10);
            Debug.Log($"[Logika] Start level {currentLevel}");
            // TODO: load level data, spawn puzzle
        }

        public void CompleteLevel(int stars, float score)
        {
            var pid = ProfileManager.Instance ? ProfileManager.Instance.ActiveProfile?.id : null;
            if (!string.IsNullOrEmpty(pid))
                ProgressManager.Instance?.ReportLevelComplete(pid, ModuleId, currentLevel, stars, score);
            Debug.Log($"[Logika] Complete L{currentLevel} stars={stars} score={score}");
        }
    }
}
