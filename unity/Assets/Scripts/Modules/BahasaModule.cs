using UnityEngine;

namespace MAS.GameEdukasi
{
    /// <summary>Bahasa module: huruf, kata, membaca. Includes voice-over hooks. TODO: TTS.</summary>
    public class BahasaModule : MonoBehaviour
    {
        [SerializeField] int currentLevel = 1;
        public string ModuleId => "bahasa";
        public int CurrentLevel => currentLevel;

        public void StartLevel(int level)
        {
            currentLevel = Mathf.Clamp(level, 1, 10);
            Debug.Log($"[Bahasa] Start level {currentLevel}");
            // TODO: play voice prompt via AudioManager
        }

        public void OnWordCompleted(string word, bool correct)
        {
            if (correct) AudioManager.Instance?.PlaySfx(null); // TODO: assign clips
            Debug.Log($"[Bahasa] Word '{word}' correct={correct}");
        }

        public void CompleteLevel(int stars, float score)
        {
            var pid = ProfileManager.Instance ? ProfileManager.Instance.ActiveProfile?.id : null;
            if (!string.IsNullOrEmpty(pid))
                ProgressManager.Instance?.ReportLevelComplete(pid, ModuleId, currentLevel, stars, score);
        }
    }
}
