class String

  def deep_strip!
    self.gsub!(/[\t\n]+/i, ' ')
    self.gsub!(/\s{2,}/, ' ')
    self
  end

  def remove_unsafe
    unsafe = ("0000".to_i(16).."001f".to_i(16)).map { |i| [i] } +
      ("007f".to_i(16).."009f".to_i(16)).map { |i| [i] } +
      ("0600".to_i(16).."0604".to_i(16)).map { |i| [i] } +
      ("200c".to_i(16).."200f".to_i(16)).map { |i| [i] } +
      ("2028".to_i(16).."202f".to_i(16)).map { |i| [i] } +
      ("2060".to_i(16).."206f".to_i(16)).map { |i| [i] } +
      ("fff0".to_i(16).."ffff".to_i(16)).map { |i| [i] } +
      ["00ad", "070f", "17b4", "17b5", "feff"].map { |i| [i.to_i(16)] }
    begin
      unpacked = ActiveSupport::Multibyte::Unicode.g_unpack(self)
      unpacked = unpacked.map do |x|
        x unless unsafe.index(x)
      end.compact
      ActiveSupport::Multibyte::Unicode.g_pack(unpacked)
    rescue ActiveSupport::Multibyte::EncodingError, TypeError
      ActiveSupport::Multibyte::Unicode.tidy_bytes(self)
    end
  end

end