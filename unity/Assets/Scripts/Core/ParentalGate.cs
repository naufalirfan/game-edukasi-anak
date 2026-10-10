using UnityEngine;

namespace MAS.GameEdukasi
{
    /// <summary>Simple parental gate (e.g. 3-digit challenge). TODO: replace with math question.</summary>
    public class ParentalGate : MonoBehaviour
    {
        [SerializeField] string gateQuestion = "Berapa 7 x 3 ?";
        [SerializeField] string gateAnswer = "21";
        string input = "";

        public bool IsPassed { get; private set; }

        public string Question => gateQuestion;

        public void AppendInput(string c) { if (input.Length < 8) input += c; }
        public void ClearInput() { input = ""; }
        public string CurrentInput => input;

        public bool Submit(string attempt)
        {
            bool ok = attempt != null && attempt.Trim() == gateAnswer;
            IsPassed = ok;
            if (!ok) input = "";
            return ok;
        }

        public bool SubmitCurrent() => Submit(input);

        public void ResetGate() { IsPassed = false; input = ""; }
    }
}
