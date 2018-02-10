defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Game.new()
      socket = socket
      |> assign(:game, game)
      {:ok, %{"join" => name, "game" => Game.init()}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("click", payload, socket) do
    comp = payload["comp"]
    clicks = payload["clicks"]
    displayLetter = payload["displayLetter"]
    cond do
      comp == 0 ->
        tile = payload["tile"]
        game = Game.display_one(socket.assigns[:game], displayLetter, tile, clicks)
        {:reply, {:ok, %{"game" => game}}, socket}
      true ->
        one = payload["one"]
        two = payload["two"]
        newState = socket.assigns[:game]
        |> Game.display_one(displayLetter, two, clicks)
        cond do
          Game.compare(socket.assigns[:game], one, two) ->
            {:reply, {:ok, %{"game" => newState}}, socket}
          true ->
            hideState = Game.hideDisplay(displayLetter, one, two)
            {:reply, {:notok, %{"game" => newState, "hide" => hideState}}, socket}
        end
    end
  end

  def handle_in("reset", payload, socket) do
    game = Game.new()
    socket = socket
    |> assign(:game, game)
    {:reply, {:ok, %{"game" => Game.init}}, socket}
  end

  # # Channels can be used in a request/response fashion
  # # by sending replies to requests from the client
  # def handle_in("ping", payload, socket) do
  #   {:reply, {:ok, payload}, socket}
  # end

  # # It is also common to receive messages from the client and
  # # broadcast to everyone in the current topic (games:lobby).
  # def handle_in("shout", payload, socket) do
  #   broadcast socket, "shout", payload
  #   {:noreply, socket}
  # end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
