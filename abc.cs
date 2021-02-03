public class VscodeInteropEvent
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Command { get; set; }
    public string TargetOne { get; set; }
    public string Message { get; set; }
    public string TargetTwo { get; set; }
    public string Result { get; set; }
}