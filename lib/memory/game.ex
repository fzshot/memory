defmodule Memory.Game  do
  def new do
    base = ["A", "B", "C", "D", "E", "F", "G", "H"]
    letterPair = base ++ base
    |> Enum.shuffle
    %{
      letterPair: letterPair,
    }
  end

  def init() do
    displayLetter = List.duplicate("", 16)
    disabled = List.duplicate(0, 16)
    %{
      displayLetter: displayLetter,
      allow: 1,
      clicks: 0,
      comp: 0,
      check: 0,
      disabled: disabled,
    }
  end

  def new_clicks(clicks) do
    clicks + 1
  end

  def hideDisplay(displayLetter, one, two) do
    displayLetter = displayLetter
    |> List.replace_at(one, "")
    |> List.replace_at(two, "")
    %{
      displayLetter: displayLetter
    }
  end

  def display_one(game, displayLetter, tile, clicks) do
    letterPair = game.letterPair
    displayLetter = displayLetter
    |> List.replace_at(tile, Enum.at(letterPair, tile))
    %{
      displayLetter: displayLetter,
      clicks: new_clicks(clicks),
      comp: 1
    }
  end

  def compare(game, one, two) do
    letterPair = game.letterPair
    Enum.at(letterPair, one) == Enum.at(letterPair, two)
  end

end
