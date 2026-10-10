using UnityEngine;

namespace MAS.GameEdukasi
{
    /// <summary>Kreativitas: mewarnai, musik, bercerita. TODO: save creations to gallery.</summary>
    public class KreativitasModule : MonoBehaviour
    {
        public string ModuleId => "kreativitas";
        [SerializeField] int currentLevel = 1;
        public int CurrentLevel => currentLevel;

        public void StartLevel(int level)
        {
            currentLevel = Mathf.Clamp(level, 1, 10);
            Debug.Log($"[Kreativitas] Start level {currentLevel}");
        }

        public void SaveCreation(string title)
        {
            Debug.Log($"[Kreativitas] Saved '{title}' for level {currentLevel}");
            // TODO: screenshot + gallery + reward
        }

        public void CompleteLevel(int stars, float score)
        {
            var pid = ProfileManager.Instance ? ProfileManager.Instance.ActiveProfile?.id : null;
            if (!string.IsNullOrEmpty(pid))
                ProgressManager.Instance?.ReportLevelComplete(pid, ModuleId, currentLevel, stars, score);
        }
    }
}
