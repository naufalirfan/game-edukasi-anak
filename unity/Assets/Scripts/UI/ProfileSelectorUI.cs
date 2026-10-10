using UnityEngine;
using UnityEngine.UI;

namespace MAS.GameEdukasi
{
    /// <summary>Profile selection screen. TODO: bind to real prefab + avatar sprites.</summary>
    public class ProfileSelectorUI : MonoBehaviour
    {
        [SerializeField] Transform listRoot;
        [SerializeField] Button createButton;
        [SerializeField] GameObject profileCardPrefab;

        void Start() => Refresh();

        public void Refresh()
        {
            var mgr = ProfileManager.Instance;
            if (mgr == null) return;
            // TODO: instantiate cards under listRoot
            Debug.Log($"[ProfileSelector] {mgr.profiles.Count} profiles");
        }

        public void OnCreateProfile(string name, int age)
        {
            var ok = ProfileManager.Instance?.CreateProfile(name, age, "default");
            if (ok == true) Refresh();
        }

        public void OnSelectProfile(string id)
        {
            ProfileManager.Instance?.SelectProfile(id);
            // TODO: SceneManager.LoadScene("Gameplay")
        }
    }
}
