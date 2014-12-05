module Admin::FormHelper
  def setup_voice(voice)
    voice.slugs.build
    voice
  end
end