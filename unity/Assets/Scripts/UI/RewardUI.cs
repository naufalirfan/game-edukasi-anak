using UnityEngine;
using TMPro;

namespace MAS.GameEdukasi
{
    /// <summary>Reward popup: stars, badge, voice praise. TODO: particle + SFX.</summary>
    public class RewardUI : MonoBehaviour
    {
        [SerializeField] TextMeshProUGUI rewardText;
        [SerializeField] GameObject[] stars = new GameObject[3];
        [SerializeField] AudioClip rewardSfx;

        public void ShowReward(int starCount, string message)
        {
            starCount = Mathf.Clamp(starCount, 0, 3);
            if (rewardText) rewardText.text = message ?? $"Hebat! {starCount} bintang!";
            for (int i = 0; i < stars.Length; i++) if (stars[i]) stars[i].SetActive(i < starCount);
            gameObject.SetActive(true);
            if (rewardSfx) AudioManager.Instance?.PlaySfx(rewardSfx);
            // TODO: voice-over praise via AudioManager.PlayVoice
        }

        public void Hide() => gameObject.SetActive(false);
    }
}
