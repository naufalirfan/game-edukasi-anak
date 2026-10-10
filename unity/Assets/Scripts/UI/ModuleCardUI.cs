using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace MAS.GameEdukasi
{
    /// <summary>Card for a module on home screen. Shows progress stars.</summary>
    public class ModuleCardUI : MonoBehaviour
    {
        [SerializeField] string moduleId;
        [SerializeField] TextMeshProUGUI titleText;
        [SerializeField] Slider progressBar;
        [SerializeField] Button playButton;

        public void Bind(string id, string title)
        {
            moduleId = id;
            if (titleText) titleText.text = title;
            Refresh();
        }

        void Refresh()
        {
            var pid = ProfileManager.Instance ? ProfileManager.Instance.ActiveProfile?.id : null;
            if (string.IsNullOrEmpty(pid) || string.IsNullOrEmpty(moduleId)) return;
            var m = ProgressManager.Instance?.GetOrCreate(pid, moduleId);
            if (m != null && progressBar) progressBar.value = (float)m.completedLevels / Mathf.Max(1, m.totalLevels);
        }

        public void OnPlayClicked()
        {
            Debug.Log($"[ModuleCard] Play {moduleId}");
            // TODO: SceneManager.LoadScene("Gameplay") with module param
        }
    }
}
